module.exports = function SocketModule (sio,socket) {
    var numUsers = 0;
    var addedUser = false;
    
    // 当客户端发出“新消息”时，将侦听并执行
    socket.on('new message', (data) => {

        //给除了自己以外的客户端广播消息
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: data
        });
    });
    
    // 当客户端发出“add user”时，这将侦听并执行
    socket.on('add user', (username) => {
        if (addedUser) return;
    
        // 我们将用户名存储在此客户端的套接字会话中。
        socket.username = username;
        ++numUsers;
        addedUser = true;
        socket.emit('login', {
            numUsers: numUsers
        });
        // 全局回显某人已连接的(所有客户端)
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers
        });
    });
    
    // 当客户端发出“键入”时，我们会将其广播给其他用户。
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });
    
    // 当客户端发出“停止键入”时，我们会将其广播给其他用户。
    socket.on('stop typing', () => {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });
    
    // 当用户断开连接时.执行此操作
    socket.on('disconnect', () => {
        if (addedUser) {
            --numUsers;
            // 此客户端已离开的全局回显
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers
            });
        }
    });

};