package main

import (
	"fmt"
	"justjot-backend/funcs"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/*", apis.StaticDirectoryHandler(os.DirFS("./pb_public"), false))
		return nil
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.POST("/refetch/:itemId", func(c echo.Context) error {
			itemId := c.PathParam("itemId")
			fmt.Println("refetch", itemId)
			itemRecord, err := app.Dao().FindRecordById("items", itemId)
			if err != nil {
				return c.JSON(http.StatusNotFound, map[string]string{"message": "requested item not found"})
			}

			processedUrl := funcs.TryAddProtocolToUrl(itemRecord.Get("content").(string))
			_, err = url.ParseRequestURI(processedUrl)
			if err != nil {
				return c.JSON(http.StatusNoContent, map[string]string{"message": "content is not valid url"})
			}

			funcs.TryFetchTitleAndFavicon(app, itemRecord, processedUrl)

			return c.JSON(http.StatusOK, map[string]string{"message": "Refetch successful"})
		})

		return nil
	})

	app.OnRecordAfterCreateRequest("users").Add(func(e *core.RecordCreateEvent) error {
		err := funcs.HandleNewUserRegistration(app, e)
		if err != nil {
			app.Logger().Error(
				"Error handling HandleNewUserRegistration",
				"error", err,
			)
			return err
		}

		return nil
	})

	app.OnModelAfterCreate("items").Add(func(e *core.ModelEvent) error {
		err := funcs.HandleNewItemCreated(app, e)
		if err != nil {
			app.Logger().Error(
				"Error handling OnModelAfterCreate",
				"error", err,
			)
			return err
		}

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
