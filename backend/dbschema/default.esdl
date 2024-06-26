module default {
    type User {
        required username: str {
            constraint exclusive;
        }
        multi todos: Todo;
    }

    type Todo{
        title: str;
        description: str;
        hours: int32;
        deadline: str;
    }
}
