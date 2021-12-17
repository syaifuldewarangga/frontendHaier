import React, { useEffect, useState } from 'react';
import './UserRegisterProduct.css';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import SelectSearch, { fuzzySearch } from 'react-select-search';
import './SelectSearch.css';
import { format } from 'date-fns';
import AlertModal from '../../alertModal/AlertModal';
import { Modal } from 'bootstrap';
import { client_id, client_secret, grant_type } from '../../../variable';
import { useTranslation } from 'react-i18next';
var X2JS = require('x2js');

function UserRegisterProduct() {
  return (
    <div>
      berhasil
    </div>
  )
}

export default UserRegisterProduct
