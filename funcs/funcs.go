package funcs

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/mails"
)

func HandleNewUserRegistration(e *core.RecordCreateEvent) error {
	app := pocketbase.New()
	errPrefix := "ERROR handle new registration: "

	err := SendVerificationEmail(e)
	if err != nil {
		app.Logger().Info(errPrefix + "sending verification email")
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

// func CreateNewDataForNewUser(e *core.RecordCreateEvent) error {

// }
