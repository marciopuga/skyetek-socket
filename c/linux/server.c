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
unsigned char isStop = 0;
unsigned char SelectLoopCallback(LPSKYETEK_TAG lpTag, void *user)
{
    if( !isStop && lpTag != NULL ) {
        printf("Tag: %s; Type: %s\n", lpTag->friendly,
        SkyeTek_GetTagTypeNameFromType(lpTag->type);
        SkyeTek_FreeTag(lpTag);
    }
    return( !isStop );
}

int CallSelectTags(LPSKYETEK_READER lpReader)
{
    SKYETEK_STATUS st;
    // the SkyeTek_SelectTags function does not return until the loop is done
    printf("Entering select loop...\n");
    st = SkyeTek_SelectTags(lpReader,AUTO_DETECT,SelectLoopCallback,0,1, NULL);
    if( st != SKYETEK_SUCCESS ) {
        printf("Select loop failed\n");
        return 0;
    }
    printf("Select loop done\n");
    return 1;
}
 
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
    const int tests = 5;        //number of open/close tests to perform
    const int iterations = 20;  //number of select tag operations to perform for each test
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

    if((numDevices = SkyeTek_DiscoverDevices(&devices)) > 0)
    {
        //printf("example: devices=%d", numDevices);
        if((numReaders = SkyeTek_DiscoverReaders(devices,numDevices,&readers)) > 0 )
        {
            CallSelectTags(readers[0]);
        }
    }
     

    while( (client_sock = accept(socket_desc, (struct sockaddr *)&client, (socklen_t*)&c)) )
    {
        puts("Connection accepted");
        puts("Handler assigned");
        

    }
    isStop = 1;
    SkyeTek_FreeDevices(devices,numDevices);
    SkyeTek_FreeReaders(readers,numReaders);
     
    if (client_sock < 0)
    {
        
        printf("Connection finished\n");
        perror("accept failed");
        return 1;
    }
     //Free the socket pointer
    close(client_sock);

    return 0;
}



