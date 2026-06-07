class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword;
    if (keyword) {
      this.query = this.query.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { tags: { $regex: keyword, $options: 'i' } },
        ],
      });
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };
    const excluded = ['keyword', 'page', 'limit', 'sort', 'fields', 'minPrice', 'maxPrice', 'rating'];
    excluded.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  priceFilter() {
    const { minPrice, maxPrice } = this.queryString;
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      this.query = this.query.find({ price: priceFilter });
    }
    return this;
  }

  ratingFilter() {
    const { rating } = this.queryString;
    if (rating) {
      this.query = this.query.find({ rating: { $gte: Number(rating) } });
    }
    return this;
  }

  sort() {
    const sortBy = this.queryString.sort;
    if (sortBy === 'price_asc') this.query = this.query.sort({ price: 1 });
    else if (sortBy === 'price_desc') this.query = this.query.sort({ price: -1 });
    else if (sortBy === 'popular') this.query = this.query.sort({ salesCount: -1 });
    else this.query = this.query.sort({ createdAt: -1 });
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.page = page;
    this.limit = limit;
    return this;
  }
}

export default APIFeatures;
