let _ = require('lodash')

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
   let mostlyRepeated = _.maxBy(largestAuthor)
   console.log('largestAuthor is ', largestAuthor)
   return mostlyRepeated
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}