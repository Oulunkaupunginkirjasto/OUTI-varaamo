import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import schemas from 'middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/APIUtils';

function fetchResource(id, params = {}) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCE_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCE_GET_SUCCESS,
          { schema: schemas.resourceSchema }
        ),
        getErrorTypeDescriptor(types.API.RESOURCE_GET_ERROR),
      ],
      endpoint: buildAPIUrl(`resource/${id}`, params),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}

function fetchResources(params = {}, options = {}) {
  const fetchParams = Object.assign({}, { pageSize: 10 }, params);

  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.RESOURCES_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.RESOURCES_GET_SUCCESS,
          {
            loadNext: options.loadNext,
            requestFunction: fetchResources,
            schema: schemas.paginatedResourcesSchema,
          }
        ),
        getErrorTypeDescriptor(types.API.RESOURCES_GET_ERROR),
      ],
      endpoint: buildAPIUrl('resource', fetchParams),
      method: 'GET',
      headers: getHeadersCreator(),
      bailout: (state) => !state.api.shouldFetch.resources,
    },
  };
}

export {
  fetchResource,
  fetchResources,
};
