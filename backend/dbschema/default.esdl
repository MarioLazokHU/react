module default {
    scalar type Role extending enum<'user', 'admin'>;
    
    type UserSession {
        required expired: datetime {
            default := datetime_of_statement() + <cal::date_duration>'7 days';
        }
        required token: str{
            default := <str>uuid_generate_v4();
        }
    }

    type User extending UserSession {
        required username: str {
            constraint exclusive;
        }
        required email: str{
            constraint exclusive;
        }
        required hashedPassword: str;
        role: Role{
            default := 'admin'
        }
        multi tudos: Todo{
            on target delete allow;
        }

    }

    type Todo{
        creator: str;
        title: str;
        description: str;
        hours: int32;
        deadline: str;
    }

   
}
