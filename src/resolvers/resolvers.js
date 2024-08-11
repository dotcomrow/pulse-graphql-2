import { mergeResolvers } from '@graphql-tools/merge';

import * as Hello from '../modules/base/Query.resolvers.js'
import * as User from '../modules/user/User.resolvers.js'

var returnResolvers = [];

returnResolvers.push(Hello.default);
returnResolvers.push(User.default);

const resolvers = mergeResolvers(returnResolvers);

export default {
  resolvers : resolvers
};
