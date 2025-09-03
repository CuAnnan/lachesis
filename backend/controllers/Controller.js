'use strict';

import MongoConnectionFactory from "../inc/MongoConnectionFactory.js";
import ObjectCache from "../inc/ObjectCache.js";
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
}

export default Controller;