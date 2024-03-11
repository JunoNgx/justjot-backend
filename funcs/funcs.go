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
	// err := SendVerificationEmail(e.Record)
	// if err != nil {
	// 	app.Logger().Error(
	// 		ERROR_PREFIX+"sending verification email",
	// 		"userId", e.Record.GetId(),
	// 		"error", err,
	// 	)
	// 	return nil
	// }

	collection, err := CreateCollectionForNewUser(app, e.Record)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX+"creating default collection",
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

	return nil
}

func SendVerificationEmail(userRecord *models.Record) error {
	app := pocketbase.New()
	// userId := e.Record.GetId()
	// userRecord, err := app.Dao().FindRecordById("users", userId)
	// if err != nil {
	// 	return err
	// }

	// mails.SendRecordVerification(app, userRecord)
	mails.SendRecordVerification(app, userRecord)

	return nil
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
