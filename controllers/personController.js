
const ApiError = require('../error/ApiError');
const { Person } = require('../models/models');


class PersonController {
   async create(req, res, next) {
      try {
         const {
            name,
            surname
         } = req.body;

         if (!name || !surname) {
            return next(ApiError.badRequest('Имя и фамилия обязательны для заполнения!'));
         }

         const person = await Person.create({
            name,
            surname
         });
         return res.json(person);
      } catch (e) {
         next(ApiError.badRequest(e.message));
      }
   }

   async getAll(req, res) {
      let { page, limit, id } = req.query;

      page = page || 1;
      limit = limit || 10;

      let offset = page * limit - limit;

      let persons = null;

      if (!id) {
         persons = await Person.findAndCountAll({ limit, offset });
      }

      if (id) {
         persons = await Person.findAndCountAll({ where: { id }, limit, offset });
      }


      const fs = require("fs");
      const path = require('path');
      const PDFDocument = require("pdfkit-table");
      let doc = new PDFDocument({ margin: 30, size: 'A4' });
      doc.pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'static/pdf', 'persons.pdf')));

      persons.rows.sort(function (a, b) {
         return new Date(b.createdAt) - new Date(a.createdAt);
      });


      const rows = persons.rows.map(person => [person.name, person.surname, (new Date(person.createdAt)).toLocaleString('ru')]);

      let fontFamily = path.resolve(__dirname, '..', 'static/fonts', 'Roboto-Regular.ttf');

      const tableArray = {
         headers: ["Имя", "Фамилия", "Дата и время добаления"],
         rows
      };
      doc.table(tableArray, {
         width: 500,
         prepareHeader: () => doc.font(fontFamily).fontSize(18),
         prepareRow: () => {
            doc.font(fontFamily).fontSize(14);
         },
      });
      // doc.font('Times-Roman');
      doc.pipe(res);

      doc.end();
   }

}

module.exports = new PersonController();