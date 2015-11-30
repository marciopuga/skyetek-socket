/*
    C socket server example, handles multiple clients using threads
*/
#include<time.h>
#include "SkyeTekAPI.h"
#include "SkyeTekProtocol.h"
#include<stdio.h>
#include<string.h>    //strlen
#include<stdlib.h>    //strlen
#include<sys/socket.h>
#include<arpa/inet.h> //inet_addr
#include<unistd.h>    //write
 
//the thread function
// void *connection_handler(void *);
 
int main(int argc , char *argv[])
{
    int socket_desc , client_sock , c ;
    struct sockaddr_in server , client;
    char *message;

    LPSKYETEK_DEVICE *devices = NULL;
    LPSKYETEK_READER *readers = NULL;
    LPSKYETEK_TAG *tags = NULL;
    SKYETEK_STATUS status;
    unsigned short count = 0;
    int numDevices = 0;
    int numReaders = 0;
    // const int delay = 400000;   //wait at least 400ms after closing the interface before re-opening (USB enumeration)
    const int tests = 20;        //number of open/close tests to perform
    const int iterations = 10;  //number of select tag operations to perform for each test
    int failures = 0;
    int total = 0;
     
    //Create socket
    socket_desc = socket(AF_INET , SOCK_STREAM , 0);
    if (socket_desc == -1)
    {
        printf("Could not create socket");
    }
    puts("Socket created");
     
    //Prepare the sockaddr_in structure
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons( 8888 );
     
    //Bind
    if( bind(socket_desc,(struct sockaddr *)&server , sizeof(server)) < 0)
    {
        //print the error message
        perror("bind failed. Error");
        return 1;
    }
    puts("bind done");
     
    //Listen
    listen(socket_desc , 3);
     
    //Accept and incoming connection
    puts("Waiting for incoming connections...");
    c = sizeof(struct sockaddr_in);
     

    while( (client_sock = accept(socket_desc, (struct sockaddr *)&client, (socklen_t*)&c)) )
    {
        puts("Connection accepted");
        puts("Handler assigned");

        if((numDevices = SkyeTek_DiscoverDevices(&devices)) > 0)
        {
            while((numReaders = SkyeTek_DiscoverReaders(devices,numDevices,&readers)) > 0 )
            {
                printf("\tIteration = %d\n",k);
                status = SkyeTek_GetTags(readers[0], AUTO_DETECT, &tags, &count);
                if(status == SKYETEK_SUCCESS)
                {
                    if(count == 0)
                    {
                        printf("\t\tNo tags found\n");
                    }
                    else
                    {
                        for(int j = 0; j < count; j++)
                        {
                            // message = tags[j]->friendly;
                            puts(tags[j]->friendly);
                            message =  tags[j]->friendly ;
                            strcat(message,  "\n");
                            write(client_sock , message , strlen(message));
                        }
                    }
                }
                else
                {
                    printf("ERROR: GetTags failed\n");
                }
            }
            SkyeTek_FreeTags(readers[0],tags,count);
        }
    }

     
    if (client_sock < 0)
    {
        printf("Connection finished\n");
        perror("accept failed");
        return 1;
    }
    SkyeTek_FreeDevices(devices,numDevices);
    SkyeTek_FreeReaders(readers,numReaders);
     //Free the socket pointer
    close(client_sock);
    return 0;
}
