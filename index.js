const net =require("net")
const Parser=require("redis-parser")

const store={}
const server=net.createServer(connection=>{
    const parser=new Parser({
        returnReply:(reply)=>{
            const command=reply[0]
            switch(command){
                case 'set':{
                    const key=reply[1]
                    const val=reply[2]
                    store[key]=val
                    connection.write('+OK\r\n')
                }
                break

                case 'get':{
                    const key=reply[1]
                    const val=store[key]
                    if(!val){
                        connection.write('$-1\r\n')
                    }else{
                        connection.write(`$${val.length}\r\n${val}\r\n`)
                    }
                }

            }
            console.log('=>', reply)
        },
        returnError:(err)=>{
            console.log('=>',err)
        }
    })
    parser.execute(data)
    console.log("Client Connected...")
        connection.on('data',data=>{
            console.log(data.toString())
            connection.write('+0k\r\n')
        })
})

server.listen(6370,()=>{
    console.log("myredis is running on port 6370")
})