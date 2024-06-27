module default {
    scalar type Role extending enum<'user', 'admin'>;
    
    type Session {
        required expired: datetime {
            default := datetime_of_statement() + <cal::date_duration>'7 days';
        }
        required token: str{
            default := <str>uuid_generate_v4();
        }
    }

    type User extending Session {
        required username: str {
            constraint exclusive;
        }
        required email: str{
            constraint exclusive;
        }
        required hashedPassword: str;
        multi todos: Todo;
        role: Role{
            default := 'admin'
        }
    }

    type Todo{
        title: str;
        description: str;
        hours: int32;
        deadline: str;
    }

   
}
