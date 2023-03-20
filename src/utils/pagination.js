class Pagination {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
        title: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  //*Sorting by location
  sort() {
    const location = this.queryStr.location
      ? {
        location: {
          $regex: this.queryStr.location,
          $options: "i"
        },
      } : {};
    this.query = this.query.find({ ...location });
    return this
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }

}
module.exports = Pagination