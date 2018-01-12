const Thumbnail = `
  type Thumbnail {
    id: Int
    src: String
    sizes: [ThumbnailSize]
  }
`

const Size = `
  type ThumbnailSize {
    size: String,
    file: String
  }
`

export default [Thumbnail, Size]