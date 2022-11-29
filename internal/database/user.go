package database

import (
	"database/sql"
	"errors"
	"strconv"

	"real-time-forum/internal/models"
	
	_ "github.com/mattn/go-sqlite3"
)

//Attempts to insert a user into the database, returns an error if it cannot
func NewUser(path string, u models.User) error {
	//Open database
	db, err := OpenDB(path)
	if err != nil {
		return err
	}

	defer db.Close()

	//Execute the insert statement
	_, err = db.Exec(AddUser, u.Username, u.Firstname, u.Surname, u.Gender, u.Email, u.DOB, u.Password)
	if err != nil {
		return err
	}

	return nil
}

//Converts user table query results into an array of user structs
func ConvertRowToUser(rows *sql.Rows) ([]models.User, error){
	var users []models.User

	//Loops through the rows provided
	for rows.Next() {
		var u models.User
		
		//Stores the row data in a temporary user struct
		err := rows.Scan(&u.Id, &u.Username, &u.Firstname, &u.Surname, &u.Gender, &u.Email, &u.DOB, &u.Password)
		if err != nil {
			break
		}

		//Appends the temporary struct to the array
		users = append(users, u)
	}

	//Returns an error if no rows are provided
	if len(users) == 0 {
		return []models.User{}, errors.New("no rows provided")
	}

	return users, nil
}

//Gets all users from the database
func FindAllUsers(path string) ([]models.User, error) {
	//Opens the database
	db, err := OpenDB(path)
	if err != nil {
		return []models.User{}, errors.New("failed to open database")
	}

	defer db.Close()

	//Finds all the users
	rows, err := db.Query(GetAllUser)
	if err != nil {
		return []models.User{}, errors.New("failed to find users")
	}

	//Convert the rows to an array of users
	users, err := ConvertRowToUser(rows)
	if err != nil {
		return []models.User{}, errors.New("failed to convert")
	}

	return users, nil
}

//Finds user from the database based on the passed parameter (id, username, email)
func FindUserByParam(path, parameter, data string) (models.User, error) {
	var q *sql.Rows

	//Opens the database
	db, err := OpenDB(path)
	if err != nil {
		return models.User{}, errors.New("failed to open database")
	}

	defer db.Close()

	//Checks which parameter to search the database by
	switch parameter {
	case "id":
		//Converts the data to an integer
		i, err := strconv.Atoi(data)
		if err != nil {
			return models.User{}, errors.New("id must be an integer")
		}

		//Searches the database by id
		q, err = db.Query(GetUserById, i)
		if err != nil {
			return models.User{}, errors.New("could not find id")
		}
	case "username":
		//Searches the database by username
		q, err = db.Query(GetUserByUsername, data)
		if err != nil {
			return models.User{}, errors.New("could not find username")
		}
	case "email":
		//Searches the database by email
		q, err = db.Query(GetUserByEmail, data)
		if err != nil {
			return models.User{}, errors.New("could not find email")
		}
	default:
		//Returns an error if searched by a different parameter
		return models.User{}, errors.New("cannot search by that parameter")
	}

	//Converts the database row to a user struct
	user, err := ConvertRowToUser(q)
	if err != nil {
		return models.User{}, errors.New("failed to convert")
	}

	return user[0], nil
}

//Finds the currently logged in user from the cookie
func CurrentUser(path, val string) (models.User, error) {
	//Open database
	db, err := OpenDB(path)
	if err != nil {
		return models.User{}, err
	}

	defer db.Close()

	q, err := db.Query(GetSessionUser, val)
	if err != nil {
		return models.User{}, err
	}

	users, err := ConvertRowToUser(q)
	if err != nil {
		return models.User{}, err
	}

	return users[0], nil
}