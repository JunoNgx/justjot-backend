package funcs

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/forms"
	"github.com/pocketbase/pocketbase/mails"
	"github.com/pocketbase/pocketbase/models"
)

const ERROR_PREFIX string = "ERROR handle new registration: "

func HandleNewUserRegistration(app *pocketbase.PocketBase, e *core.RecordCreateEvent) error {
	SendVerificationEmail(app, e.Record)

	collection, err := CreateCollectionForNewUser(app, e.Record)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX+"creating default collection",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateLinkForNewUser(app, e.Record, collection)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX+"creating link",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateColourNoteForNewUser(app, e.Record, collection)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX+"creating colour note",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateShortNoteForNewUser(app, e.Record, collection)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX+"creating short note",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateLongNoteForNewUser(app, e.Record, collection)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX+"creating short note",
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

func CreateShortNoteForNewUser(app *pocketbase.PocketBase, userRecord *models.Record, collectionRecord *models.Record) error {
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
