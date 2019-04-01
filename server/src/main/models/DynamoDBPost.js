
const categories = [
    { id: 'life', label: 'Life' },
    { id: 'food', label: 'Food' },
    { id: 'inspiration', label: 'Inspiration' }
];

function DynamoDBPost(p) {
    if(p.id) {
        this.ID = { S: p.id };
    } else {
        throw 'Invalid post, missing "id" property';
    }

    if(p.author) {
        this.Author = { S: p.author };
    } else {
        throw 'Invalid post, missing "author" property';
    }

    if(p.title) {
        this.Title = { S: p.title };
    } else {
        throw 'Invalid post, missing "title" property';
    }

    if(p.createdTime) {
        this.CreatedTime = { S: p.createdTime };
    } else {
        throw 'Invalid post, missing "createdTime" property'
    }

    if(p.category) {
        if(categories.some(c => c.id === p.category)) {
            this.Category = { S: p.category };
        } else {
            throw 'Invalid post, category is in-valid';
        }
    } else {
        throw 'Invalid post, missing "category" property';
    }

    if(p.published) {
        this.Published = { B: p.published };
    }

    if(p.thumnailPath) {
        this.ThumnailPath = { S: p.thumnailPath };
    } else {
        throw 'Invalid post, missing "thumnailPath" property';
    }

    if(p.bodyPath) {
        this.BodyPath = { S: p.bodyPath };
    } else {
        throw 'Invalid post, missing "bodyPath" property';
    }

    if(p.mediaPaths) {
        this.mediaPaths = { S: p.mediaPaths };
    } else {
        throw 'Invalid post, missing "mediaPaths" property';
    }
}

DynamoDBPost.prototype.getCategories = () => categories;

module.exports = DynamoDBPost;
