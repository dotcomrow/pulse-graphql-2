import { mergeResolvers } from '@graphql-tools/merge';

import * as Hello from '../modules/base/Query.resolvers.js'
import * as User from '../modules/user/User.resolvers.js'
import * as Config from '../modules/config/Config.resolvers.js'
import * as Http from '../modules/http/Http.resolvers.js'
import * as CMS from '../modules/cms/CMS.resolvers.js'
import * as FetchPictures from '../modules/pictures/fetch-requests/fetch-pictures.resolvers.js'
import * as SavePictures from '../modules/pictures/save-requests/save-pictures.resolvers.js'

var returnResolvers = [];

returnResolvers.push(Hello.default);
returnResolvers.push(User.default);
returnResolvers.push(Config.default);
returnResolvers.push(Http.default);
returnResolvers.push(CMS.default);
returnResolvers.push(FetchPictures.default);
returnResolvers.push(SavePictures.default);

const resolvers = mergeResolvers(returnResolvers);

export default {
  resolvers : resolvers
};
