package funcs

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/mails"
	"github.com/pocketbase/pocketbase/models"
)

const ERROR_PREFIX string = "ERROR handle new registration: "

func HandleNewUserRegistration(e *core.RecordCreateEvent) error {
	app := pocketbase.New()

	err := SendVerificationEmail(e.Record)
	if err != nil {
		app.Logger().Error(
			ERROR_PREFIX+"sending verification email",
			"userId", e.Record.GetId(),
			"error", err,
		)
		return nil
	}

	collection, err := CreateCollectionForNewUser(e)
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

func CreateCollectionForNewUser(e *core.RecordCreateEvent) (*models.Record, error) {
	// fmt.Println("CreateCollectionForNewUser")
	return nil, nil
}

func CreateColourNoteForNewUser(e *core.RecordCreateEvent, collection *models.Record) error {
	// fmt.Println("CreateColourNoteForNewUser")
	return nil
}
