const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { config } = require('./../config/config');

const UserService = require('./user.service');
const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token,
    };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const mail = {
      from: config.emailUser,
      to: `${user.email}`,
      subject: 'Email in order to recovery the password',
      html: `<b>Follow the link in order to recovery your password: ${link}</b>`,
    };

    const rta = await this.sendMail(mail);
    return rta;
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }
}

module.exports = AuthService;
