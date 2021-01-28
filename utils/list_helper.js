let _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (array) => {
  //...
  return 1
}

const totalLikes = (array) => {
  //reducer loops through the array
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return array.length === 0
    ? 0
  //uses the reduce method defined above, starts from sum = 0, as 0 has been passed as the second parameter below
  //item is each item in the array
    : array.reduce(reducer, 0)
}

const favoriteBlog = (array) => {
  const reducer = (likes, item ) => {
    if (likes < item.likes){
      //console.log('item.likes is ', item.likes)
      return item.likes
    }else {
      //console.log('likes is', likes)
      return likes
    }
  }
  //store the highest likes in the variable below
  let maxLikes = array.reduce(reducer, 0)
  //console.log('maxLikes', maxLikes)
  //find method returns in the object format , whereas filter returns as an array
  // and filter gives all the matching results but find gives only the first matching
  const blog = array.find(item => item.likes === maxLikes)

  let finalBlog = (object) => {
    delete object.__v,
    delete object._id,
    delete object.url
    return object
  }
  return finalBlog(blog)
}

const mostBlogs = (array) => {
  let largestAuthor = _.countBy(array, 'author')
  // eslint-disable-next-line no-undef
  let author = _.max(Object.keys(largestAuthor), o => obj[o])
  // eslint-disable-next-line no-undef
  let blogs = _.max(Object.values(largestAuthor), o => obj[o])
  let mostlyRepeated = {
    author: author,
    blogs: blogs
  }

  return mostlyRepeated
}

const mostLikes = (array) => {
  let maxLikes = _.maxBy(array, 'likes')
  let result = {
    author: maxLikes.author,
    likes: maxLikes.likes
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}