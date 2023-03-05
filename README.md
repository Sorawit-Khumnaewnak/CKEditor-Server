# CKEditor-Server

### How to run by pm2 and startup.   ( ! ! Recommend ! ! )

1. Run WebApplication by pm2 and startup-save
```
$: pm2 start server.js --name CKEditor-Server
$: pm2 startup
$: pm2 save
```
2. Can check status
```
$: pm2 ls
```

3. Can start, restart, stop or delete

- Start
```
$: pm2 start 'id'
```

- Restart
```
$: pm2 restart 'id'
```

- Stop
```
$: pm2 stop 'id'
```

- Delete
```
$: pm2 delete 'id'
```
