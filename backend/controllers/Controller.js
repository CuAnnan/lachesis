import MongoConnectionFactory from "../inc/MongoConnectionFactory.js";
import ObjectCache from "../inc/ObjectCache.js";

const singletonMap = new WeakMap();
class Controller
{


    /**
     *  @returns {ObjectCache}
     */
    get cache()
    {
        return ObjectCache.getInstance();
    }

    get db()
    {
        return MongoConnectionFactory.getInstance();
    }

    getHost(req)
    {
        return `${req.protocol}://${req.get('Host')}`;
    }

    static getInstance(ctor)
    {
        if(!singletonMap.has(ctor))
        {
            singletonMap.set(ctor, new ctor());
        }
        return singletonMap.get(ctor);

    }
}

export default Controller;