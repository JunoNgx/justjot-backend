package funcs

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/mails"
	"github.com/pocketbase/pocketbase/models"
)

func HandleNewUserRegistration(e *core.RecordCreateEvent) error {
	app := pocketbase.New()
	errPrefix := "ERROR handle new registration: "

	err := SendVerificationEmail(e)
	if err != nil {
		app.Logger().Info(errPrefix + "sending verification email")
		return nil
	}

	collection, err := CreateCollectionForNewUser(e)
	if err != nil {
		app.Logger().Info(errPrefix + "creating new collection")
		return nil
	}

	err = CreateColourNoteForNewUser(e, collection)
	if err != nil {
		app.Logger().Info(errPrefix + "creating new collection")
		return nil
	}

	return nil
}

func SendVerificationEmail(e *core.RecordCreateEvent) error {
	app := pocketbase.New()
	// userId := e.Record.GetId()
	// userRecord, err := app.Dao().FindRecordById("users", userId)
	// if err != nil {
	// 	return err
	// }

	// mails.SendRecordVerification(app, userRecord)
	mails.SendRecordVerification(app, e.Record)

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
