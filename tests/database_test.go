package tests

import (
	"testing"

	"real-time-forum/internal/database"
	"real-time-forum/internal/models"
)

const (
	path = "test.db"
)

var users = []models.User{
	{
		Username: "Person1",
		Firstname: "John",
		Surname: "Smith",
		Gender: "Male",
		Email: "email1@email.com",
		DOB: "01/01/2000",
		Password: "password",
	},
	{
		Username: "Person2",
		Firstname: "Jane",
		Surname: "Smith",
		Gender: "Female",
		Email: "email2@email.com",
		DOB: "01/01/2000",
		Password: "password",
	},
	{
		Username: "Person3",
		Firstname: "Mark",
		Surname: "Smith",
		Gender: "Male",
		Email: "email3@email.com",
		DOB: "01/01/2000",
		Password: "password",
	},
}

func TestDBInitialisation(t *testing.T) {
	err := database.InitDB(path)
	if err != nil {
		t.Errorf("Failed to initialise database: %q", err)
	}
}

func TestOpenDB(t *testing.T) {
	_, err := database.OpenDB(path)
	if err != nil {
		t.Errorf("Failed to open database: %q", err)
	}
}

func TestAddNewUser(t *testing.T) {
	db, err := database.OpenDB(path)
	if err != nil {
		t.Errorf("Failed to open database: %q", err)
	}

	defer db.Close()

	t.Run("Adds users to database", func(t *testing.T) {
		for _, i := range users {
			err := database.NewUser(path, i)
			if err != nil {
				t.Errorf("Failed to add user: %q", err)
			}
		}
	})

	t.Run("Fails to add new user (username already exists)", func(t *testing.T) {
		u := models.User{
			Username: "Person1",
			Firstname: "John",
			Surname: "Smith",
			Gender: "Male",
			Email: "email@email.com",
			DOB: "01/01/2000",
			Password: "password",
		}

		err := database.NewUser(path, u)
		if err == nil {
			t.Errorf("Added user with already existing username")
		}
	})

	t.Run("Fails to add new user (email already exists)", func(t *testing.T) {
		u := models.User{
			Username: "Person",
			Firstname: "John",
			Surname: "Smith",
			Gender: "Male",
			Email: "email2@email.com",
			DOB: "01/01/2000",
			Password: "password",
		}

		err := database.NewUser(path, u)
		if err == nil {
			t.Errorf("Added user with already existing email")
		}
	})
}

func TestFindUserByParam(t *testing.T) {
	db, err := database.OpenDB(path)
	if err != nil {
		t.Errorf("Failed to open database: %q", err)
	}

	defer db.Close()

	t.Run("Find user by id", func(t *testing.T) {
		found, err := database.FindUserByParam(path, "id", "1")
		if err != nil {
			t.Errorf("Failed to find user: %q", err)
		}

		if found.Username != users[0].Username {
			t.Errorf("Found incorrect user: found %q, want %q", found.Username, users[0].Username)
		}
	})

	t.Run("Search for user with nonexistant id", func(t *testing.T) {
		found, err := database.FindUserByParam(path, "id", "0")
		if err == nil {
			t.Errorf("Found user with incorrect id: found %q id %q", found.Username, found.Id)
		}
	})

	t.Run("Find user by username", func(t *testing.T) {
		found, err := database.FindUserByParam(path, "username", "Person2")
		if err != nil {
			t.Errorf("Failed to find user: %q", err)
		}

		if found.Username != users[1].Username {
			t.Errorf("Found incorrect user: found %q, want %q", found.Username, users[1].Username)
		}
	})

	t.Run("Search for user with nonexistant username", func(t *testing.T) {
		found, err := database.FindUserByParam(path, "username", "NotAUsername")
		if err == nil {
			t.Errorf("Found user with incorrect username: found %q", found.Username)
		}
	})

	t.Run("Find user by email", func(t *testing.T) {
		found, err := database.FindUserByParam(path, "email", "email3@email.com")
		if err != nil {
			t.Errorf("Failed to find user: %q", err)
		}

		if found.Email != users[2].Email {
			t.Errorf("Found incorrect user: found %q, want %q", found.Username, users[2].Username)
		}
	})

	t.Run("Search for user with nonexistant email", func(t *testing.T) {
		found, err := database.FindUserByParam(path, "email", "notanemail@email.com")
		if err == nil {
			t.Errorf("Found user with incorrect id: found %q email %q", found.Username, found.Email)
		}
	})
}

func TestFindAllUsers(t *testing.T) {
	db, err := database.OpenDB(path)
	if err != nil {
		t.Errorf("Failed to open database: %q", err)
	}

	defer db.Close()

	found, err := database.FindAllUsers(path)
	if err != nil {
		t.Errorf("Failed to find users: %q", err)
	}

	if len(found) != len(users) {
		t.Errorf("Failed to find all users: found %q users, want %q users", len(found), len(users))
	}
}