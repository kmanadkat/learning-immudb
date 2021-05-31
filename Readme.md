## verifiedGet Error After Re-Login & Token Refresh

<u>31st May - 2021</u>
First of all, I really appreciate you guys and efforts you have made to creat such an amazing immutable database & on top of that a Node Js SDK. I guess there is no other opensource library of immutable db with Node Js SDK. Its a pioneering work I believe.



### Steps To Reproduce Error

1. I have added  `immudb`  executable path in global envrionment path variables
2. Clone this repository
3. Observe configuration variables of immundb modified in `immdub.toml` file. Specifically note `token-expiry-time` to 1 minute, so i can test faster. I also made it to use `db` folder in the current directory in order to prevent polluting global disk storage.
4. Run `npm install` in project directory to download dependencies.
5. Run `immudb --config ./immudb.toml --detached` to start `immudb` process, reading config from `immudb.toml` & running in detached mode.
```shell
 _                               _ _     
(_)                             | | |    
 _ _ __ ___  _ __ ___  _   _  __| | |__  
| | '_ ` _ \| '_ ` _ \| | | |/ _` | '_ \ 
| | | | | | | | | | | | |_| | (_| | |_) |
|_|_| |_| |_|_| |_| |_|\__,_|\__,_|_.__/ 

immudb 1.0.0
Commit  : fb5398fe7b7d69dd352685d477fbd01a86b64568
Built by: cleaversdev@gmail.com
Built at: Fri, 21 May 2021 16:29:30 IST
================ Config ================
Data dir         : ./db
Address          : 127.0.0.1:8001
Metrics address  : 127.0.0.1:9497/metrics
Config file      : configs/immudb.toml
PID file         : ./pid.log
Log file         : ./immudb.log
Max recv msg size: 33554432
Auth enabled     : true
Dev mode         : false
Default database : defaultdb
Maintenance mode : false
Synced mode      : false
----------------------------------------
Superadmin default credentials
   Username      : immudb
   Password      : immudb
========================================
```
6. Run `node initialSetup.js` in backend directory.
```shell
immuDB user login : immudb {
  token: 'v2.public.eyJkYXRhYmFzZSI6IjAiLCJleHAiOiIyMDIxLTA1LTMxVDIwOjI2OjA0KzA1OjMwIiwic3ViIjoiaW1tdWRiIn1w66ur0mPlTBZZAh-TU21qrlJyoqRZQoo4xQbU_aA8Mvfb2DJld8CaQfT3EghRir6gSIE5NFAZTgrJgmiV6FEI.aW1tdWRi',
  warning: ''
}
immuDB DB create : blockchain {
  wrappers_: null,
  messageId_: undefined,
  arrayIndexOffset_: -1,
  array: [],
  pivot_: 1.7976931348623157e+308,
  convertedPrimitiveFields_: {}
}
immuDB User create : blockchain {
  wrappers_: null,
  messageId_: undefined,
  arrayIndexOffset_: -1,
  array: [],
  pivot_: 1.7976931348623157e+308,
  convertedPrimitiveFields_: {}
}
```
7. Run `node verifiedSetData.js` in backend directory to set data first time
```shell
immuDB user login : blockchain {
  token: 'v2.public.eyJkYXRhYmFzZSI6Ii0xIiwiZXhwIjoiMjAyMS0wNS0zMVQyMDoyODo0MSswNTozMCIsInN1YiI6ImJsb2NrY2hhaW4ifVn4993REDQPRgWZcAKgSe_cYKdFZwZXBM6sex9Y5vPMIGvmWt1kEHH5nM47C2X7J_paffm92UWkexg0g_fAaw8.aW1tdWRi',
  warning: ''
}
immuDB DB create : blockchain {
  token: 'v2.public.eyJkYXRhYmFzZSI6IjEiLCJleHAiOiIyMDIxLTA1LTMxVDIwOjI4OjQxKzA1OjMwIiwic3ViIjoiYmxvY2tjaGFpbiJ9RG8xWRadI8j7WARjVoDlnbp6Z5_uo4u52OGxZJRe70_318hObpO-KO3u0xZEmfu1WognA8K5j1CiH7kLGmzpCg.aW1tdWRi'
}
immuDB verified set student123: Robin {
  id: 1,
  prevalh: '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=',
  ts: 1622473061,
  nentries: 1,
  eh: 'zth1A7XPRNrfvbrgTHyvi2lRW2Arh4MhpnCwyqpuuak=',
  bltxid: 0,
  blroot: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
}
```
8. Run `node verifiedGetData.js` in backend directory within 1 minute of conducting above step (7).
```shell
immuDB user login : blockchain {
  token: 'v2.public.eyJkYXRhYmFzZSI6Ii0xIiwiZXhwIjoiMjAyMS0wNS0zMVQyMDoyOTo0OSswNTozMCIsInN1YiI6ImJsb2NrY2hhaW4ifTS0sRYw6NB98Y-tEMdk-yuSbQWLuaYcoDI9EENuxPSbm-KfMrhCs_5v2D7yrY6StsGvla7mvt_uQKU2nYDM6A8.aW1tdWRi',
  warning: ''
}
immuDB DB create : blockchain {
  token: 'v2.public.eyJkYXRhYmFzZSI6IjEiLCJleHAiOiIyMDIxLTA1LTMxVDIwOjI5OjQ5KzA1OjMwIiwic3ViIjoiYmxvY2tjaGFpbiJ9dDG_cR2EwwgJb8Xqa3z-swHponsFN6RtAMakzz1tyUKMn5xxd3HKGWYampLgLolp_MiBTGtewg35PmTjCuCXAg.aW1tdWRi'
}
immuDB verified get student123 { tx: 1, key: 'student123', value: 'Robin', referencedby: undefined }
```
The data could be retrieved without any issues.

9. Wait for atleast 5 minutes & execute `node verifiedGetData.js` again. This time you would see error like below:
```shell

```