const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/Users');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const crypto = require('crypto');


