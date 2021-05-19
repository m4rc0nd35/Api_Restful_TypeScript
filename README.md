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