# API_TypeScript

### Setup firewall port ubuntu in Oracle Cloud
```
apt install firewalld
firewall-cmd --permanent --zone=public --add-port=8080/tcp
firewall-cmd --reload


```

### declare you secret key
```
export SECRET_KEY=?
```

- Endpoint POST /user/auth
```
>> Request
{
    "username":"admin",
    "password": "123456"
}
<< Response
{
    "message": "Authentication success!",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- Endpoint POST /user/register (Bearer token)
```
>> Request
{
    "username": "admin",
    "password": "123456",
    "name": "administrator",
    "email": "admin@admin.com.br",
    "address": "Rua qualquer 20",
    "phone": "84999999999"
}
<< Response
{
    "message": "Success!"
}
```
- Endpoint POST /user/update/:idUser INT (Bearer token)
```
>> Request
{
    "password": "123456", // optional
    "name": "administrator", // optional
    "email": "admin@admin.com.br", // optional
    "address": "Rua qualquer 20", // optional
    "phone": "84999999999" // optional
}
<< Response
{
    "message": "Update success!",
    "affected": 1
}
```
- Endpoint GET /user/list (Bearer token)
```
<< Response
{
    "message": "user data",
    "data": [
        {
            "id": 66,
            "username": "admin",
            "name": "Administrator",
            "email": "admin@admin.com.br",
            "address": "Rua qualquer 20",
            "phone": "84999999999",
            "create_at": "2021-05-18T23:51:42.064Z"
        },
        .
        .
        .
        .
        .
        .
        .
    ]
}
```
- Endpoint GET /user/delete/:idUser (Bearer token)
```
<< Response
{
    "message": "Delete success!",
    "affected": 1
}
```
