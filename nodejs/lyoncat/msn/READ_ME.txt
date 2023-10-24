
Please follow this guide to run the application you generated!


BEFORE DOING THE BELOW STEPS MAKE SURE YOUR TERMINAL HAVE FINISHED PROCESSING THE PREVIOUS COMMAND.


Step 0). Please copy and replace the file config.ini from this zip to the default one from /assets/vaneayoung/Messenger/ini/config.ini. Rename the file like, e.g. secretconfig.ini

Step 1). Open the file PORTS.txt, make sure you have unblocked in your firewall all the ports from the list. ( if you dont know how to do, please ask your hosting support ).

Step 2). If your terminal gave error while you send the commands please follow next steps.

Step 3). Open the file cr_turnserver/turnserver.json, and enter your TURN SERVER credentials.

Step 4). Check the Nodejs application if is running, open the url in browser https://msn.rougee.io:2700, if is down check step 5.

Step 5). Open your terminal and execute the following command: $ npm install pm2 

Step 6). Execute the following command: $ cd /path/to_app/server_1684330057 (replace /path/to_app/ to your correct path where is located the application) ... if you dont have the app on your server, please upload it anywhere you want.

Step 7). Execute the following command: $ chmod +x ./server_1684330057

Step 8). Execute the following command: $ ./server_1684330057 (if you see a green message Server is running on port 2700 , its okay, go forward, if not please contact us)

Step 9). Execute the following command: $ pm2 startup

Step 10). Execute the following command: $ pm2 start --name kn_live_app --max-memory-restart 5000M server_1684330057

Step 11). Execute the following command: $ pm2 save

Step 12). Now check your app in browser (see step 4).


NOTE! In step 10 we allow 5GB RAM for the app, you can allow how much you want.
