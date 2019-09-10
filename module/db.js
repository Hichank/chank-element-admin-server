const MongoClient = require('mongodb').MongoClient;
const config = require('./config')

// MONGODB类
class DB {
    static getInstance() {
        // 解决重复实例
        if (!DB.instance) {
            DB.instance = new DB
        }
        return DB.instance
    }
    // 构造器
    constructor() {
        // 解决多次连接数据库
        this.dbClient = null;
        // 初始化时连接数据库
        this.connect()
    }
    // 连接数据库
    connect() {
        return new Promise((resolve, reject) => {
            if (this.dbClient) {
                // 已经连接
                resolve(this.dbClient)
            } else {
                // 尚未连接
                MongoClient.connect(config.dbUrl, config.dbOption, (error, client) => {
                    if (error) {
                        // 连接失败回调
                        reject(error)
                    } else {
                        // 连接成功后回调
                        this.dbClient = client.db(config.dbName)
                        resolve(this.dbClient)
                    }
                })
            }
        })
    }
    // 查询
    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect()
                .then(db => {
                    db.collection(collectionName).find(json).toArray((error, docs) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(docs)
                        }
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        })
    }

    // 插入
    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect()
                .then(db => {
                    db.collection(collectionName).insertMany(json, (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result)
                        }
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        })
    }
    // 更新
    update(collectionName, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect()
                .then(db => {
                    db.collection(collectionName).updateOne(json1, {
                        $set: json2
                    }, (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result)
                        }
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        })
    }

    delete(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect()
                .then(db => {
                    db.collection(collectionName).deleteOne(json, (error, result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result)
                        }
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        })
    }

}

module.exports = DB.getInstance()