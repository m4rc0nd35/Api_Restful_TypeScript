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

### Endpoint
```
*** Request POST
{
    "username":"eider keep",
    "password": "321654"
}
*** Response
{
    "message": "Authentication success!",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NzUsIm5hbWUiOiJqZWFuIE1hcmNvbmRlcyIsImVtYWlsIjoiZWlkZXJAZGV2Y2xvdWQuY29tLmJyIiwiaWF0IjoxNjIxNDc5NDY5LCJleHAiOjE2MjE0ODAwNjl9.wKBTUYXxdilZoCR0ke0Ovmk0RfdzGga8TTeeXi-cfQM"
}
```
