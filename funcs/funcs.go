package funcs

import (
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/mails"
)

func SendVerificationEmail(e *core.RecordCreateEvent) error {
	app := pocketbase.New()
	userId := e.Record.GetId()
	userRecord, err := app.Dao().FindRecordById("users", userId)
	if err != nil {
		return err
	}

	mails.SendRecordVerification(app, userRecord)

	return nil
}
