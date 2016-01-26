import {Injectable} from 'angular2/core';

import {Contact} from '../../core/dto';
import {HttpUtil} from '../../core/http.util';
import {BaseResourceService} from '../../core/base.service';


@Injectable()
export class ContactService extends BaseResourceService<Contact> {

  constructor(httpUtil: HttpUtil) {
    super(httpUtil, 'contact');
  }

}
