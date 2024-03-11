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

	collection, err := CreateCollectionForNewUser(e.Record, app)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX+"creating default collection",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	err = CreateColourNoteForNewUser(e, collection)
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

func CreateCollectionForNewUser(userRecord *models.Record, app *pocketbase.PocketBase) (*models.Record, error) {
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

func CreateColourNoteForNewUser(e *core.RecordCreateEvent, collection *models.Record) error {
	// fmt.Println("CreateColourNoteForNewUser")
	return nil
}
