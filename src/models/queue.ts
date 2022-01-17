import { Collection } from "mongodb"
type QueryParams = {};
type UpdateAction = {
    $set: object
};

export class TaskQueue {
    readonly queryParams: QueryParams
    readonly engine: Collection
    
    constructor(queryParams: QueryParams, engine: Collection) {
        this.queryParams = queryParams;
        this.engine = engine;
    }

    async get(): Promise<object|null> {
        const safeQuery = Object.assign({}, this.queryParams, {locked: false});
        const response = await this.engine.findOneAndUpdate(safeQuery, {'$set': {locked: true}});
        return response.value
    }
    async put(document: object) {
        await this.engine.insertOne(document);
    }
    async update(url: string, action: UpdateAction) {
        await this.engine.updateOne({url: url}, action);
    }
    async delete(url: string) {
        await this.engine.deleteOne({url: url});
    };

}