package funcs

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/mails"
	"github.com/pocketbase/pocketbase/models"
)

const ERROR_PREFIX_NEW_REGISTRATION string = "[ERROR: handle new registration] "
const ERROR_PREFIX_NEW_ITEM string = "[ERROR: handle new item] "

func HandleNewUserRegistration(app *pocketbase.PocketBase, e *core.RecordCreateEvent) error {
	SendVerificationEmail(app, e.Record)

	collection, err := CreateCollectionForNewUser(app, e.Record)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX_NEW_REGISTRATION+"creating default collection",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateLinkForNewUser(app, e.Record, collection)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX_NEW_REGISTRATION+"creating link",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateColourNoteForNewUser(app, e.Record, collection)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX_NEW_REGISTRATION+"creating colour note",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateShortTextForNewUser(app, e.Record, collection)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX_NEW_REGISTRATION+"creating short note",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateLongNoteForNewUser(app, e.Record, collection)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX_NEW_REGISTRATION+"creating short note",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	return nil
}

func SendVerificationEmail(app *pocketbase.PocketBase, userRecord *models.Record) {
	// app := pocketbase.New()
	// userId := e.Record.GetId()
	// userRecord, err := app.Dao().FindRecordById("users", userId)
	// if err != nil {
	// 	return err
	// }

	// mails.SendRecordVerification(app, userRecord)
	mails.SendRecordVerification(app, userRecord)
}

func CreateCollectionForNewUser(app *pocketbase.PocketBase, userRecord *models.Record) (*models.Record, error) {
	userId := userRecord.GetId()

	collectionsCollection, err := app.Dao().FindCollectionByNameOrId("itemCollections")
	if err != nil {
		return nil, err
	}

	firstCollection := models.NewRecord(collectionsCollection)
	form := forms.NewRecordUpsert(app, firstCollection)
	form.LoadData(map[string]any{
		"owner":     userId,
		"name":      "First Collection",
		"slug":      "first-collection",
		"sortOrder": 0,
	})

	err = form.Submit()
	if err != nil {
		return nil, err
	}

	return firstCollection, nil
}

func CreateLinkForNewUser(app *pocketbase.PocketBase, userRecord *models.Record, collectionRecord *models.Record) error {
	userId := userRecord.GetId()
	collectionId := collectionRecord.GetId()

	itemsCollection, err := app.Dao().FindCollectionByNameOrId("items")
	if err != nil {
		return err
	}

	item := models.NewRecord(itemsCollection)
	form := forms.NewRecordUpsert(app, item)
	form.LoadData(map[string]any{
		"owner":      userId,
		"collection": collectionId,
		"content":    "https://www.mozilla.org/",
		// title to be processed by `onModelAfterCreate` hook
	})

	err = form.Submit()
	if err != nil {
		return err
	}

	return nil
}

func CreateColourNoteForNewUser(app *pocketbase.PocketBase, userRecord *models.Record, collectionRecord *models.Record) error {
	userId := userRecord.GetId()
	collectionId := collectionRecord.GetId()

	itemsCollection, err := app.Dao().FindCollectionByNameOrId("items")
	if err != nil {
		return err
	}

	item := models.NewRecord(itemsCollection)
	form := forms.NewRecordUpsert(app, item)
	form.LoadData(map[string]any{
		"owner":      userId,
		"collection": collectionId,
		"title":      "Medium Aquamarine",
		"content":    "#66CDAA",
	})

	err = form.Submit()
	if err != nil {
		return err
	}

	return nil
}

func CreateShortTextForNewUser(app *pocketbase.PocketBase, userRecord *models.Record, collectionRecord *models.Record) error {
	userId := userRecord.GetId()
	collectionId := collectionRecord.GetId()

	itemsCollection, err := app.Dao().FindCollectionByNameOrId("items")
	if err != nil {
		return err
	}

	item := models.NewRecord(itemsCollection)
	form := forms.NewRecordUpsert(app, item)
	form.LoadData(map[string]any{
		"owner":      userId,
		"collection": collectionId,
		"title":      "Short text note",
		"content":    "Click here to copy",
	})

	err = form.Submit()
	if err != nil {
		return err
	}

	return nil
}

func CreateLongNoteForNewUser(app *pocketbase.PocketBase, userRecord *models.Record, collectionRecord *models.Record) error {
	userId := userRecord.GetId()
	collectionId := collectionRecord.GetId()

	itemsCollection, err := app.Dao().FindCollectionByNameOrId("items")
	if err != nil {
		return err
	}

	item := models.NewRecord(itemsCollection)
	form := forms.NewRecordUpsert(app, item)
	form.LoadData(map[string]any{
		"owner":      userId,
		"collection": collectionId,
		"title":      "Long text note",
		"content":    "Click here to open the editor. Text notes with more than 50 characters will have their default action automatically set to open the editor. You can manually change this behavior from the context menu (right click on a mouse; long press from a touchscreen, or Cmd/Ctrl + M from a keyboard).",
	})

	err = form.Submit()
	if err != nil {
		return err
	}

	return nil
}

const SHORT_NOTE_MAX_LEN = 50

func HandleNewItemCreated(app *pocketbase.PocketBase, e *core.ModelEvent) error {

	itemId := e.Model.GetId()
	itemRecord, err := app.Dao().FindFirstRecordByData("items", "id", itemId)
	if err != nil {
		return err
	}

	content, ok := itemRecord.Get("content").(string)
	if !ok {
		return errors.New("record item doesn't have string content")
	}
	form := forms.NewRecordUpsert(app, itemRecord)

	// Case: is link
	// Handle url without protocol, e.g. `mozilla.org`
	processedUrl := TryAddProtocolToUrl(content)
	_, err = url.ParseRequestURI(processedUrl)
	if err == nil {
		// Confirm: is valid url
		form.LoadData(map[string]any{
			"type": "link",
		})
		err = form.Submit()
		if err != nil {
			app.Logger().Error(
				ERROR_PREFIX_NEW_ITEM+"link item, type",
				"itemId", itemId,
				"content", content,
				"error", err,
			)
		}

		TryFetchTitleAndFavicon(app, itemRecord, processedUrl)

		return nil
	}

	// Case: (default fallback) is note
	form.LoadData(map[string]any{
		"type":                "text",
		"shouldCopyUponClick": len(content) <= SHORT_NOTE_MAX_LEN,
	})
	err = form.Submit()
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX_NEW_ITEM+"text item, type and shouldCopyUponClick",
			"itemId", itemId,
			"content", content,
			"error", err,
		)
	}

	return nil
}

func TryAddProtocolToUrl(url string) string {
	if !strings.HasPrefix(url, "http://") && !strings.HasPrefix(url, "https://") {
		return "https://" + url
	}

	return url
}

func TryFetchTitleAndFavicon(app *pocketbase.PocketBase, itemRecord *models.Record, processedUrl string) error {
	itemId := itemRecord.GetId()

	res, err := http.Get(processedUrl)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		app.Logger().Warn(
			"Attempt to fetch url, did not get code 200",
			"itemId", itemId,
			"processedUrl", processedUrl,
		)
		return err
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		app.Logger().Warn(
			"Attempt to fetch url, received content, but couldn't parse",
			"itemId", itemId,
			"processedUrl", processedUrl,
		)
		return err
	}

	title := doc.Find("title").First().Text()
	faviconUrl, doesFaviconEexist := doc.Find("link[rel~=\"icon\"]").Attr("href")

	if doesFaviconEexist {
		faviconUrl = TryFixFaviconPath(faviconUrl, processedUrl)
	}

	fmt.Println("fetched", title, faviconUrl)

	form := forms.NewRecordUpsert(app, itemRecord)
	form.LoadData(map[string]any{
		"title":      title,
		"faviconUrl": faviconUrl,
	})
	err = form.Submit()
	if err != nil {
		app.Logger().Warn(
			ERROR_PREFIX_NEW_ITEM+"link item, title and favicon",
			"itemId", itemId,
			"processedUrl", processedUrl,
			"title", title,
			"faviconUrl", faviconUrl,
			"error", err,
		)
	}

	return nil
}

func TryFixFaviconPath(faviconUrl string, pageUrl string) string {
	parsedFaviconUrl, err := url.ParseRequestURI(faviconUrl)
	if err == nil {
		// Relative path like `/favicon.ico` will pass
		// Try adding the protocol and hostname
		parsedPageUrl, _ := url.ParseRequestURI(pageUrl)

		if parsedFaviconUrl.Host == "" {
			faviconUrl = parsedPageUrl.Host + faviconUrl
		}

		if parsedFaviconUrl.Scheme == "" {
			faviconUrl = "https://" + faviconUrl
		}

		return faviconUrl
	}

	return ""
}
