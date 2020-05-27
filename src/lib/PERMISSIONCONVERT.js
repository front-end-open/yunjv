function Convert(obj) {
  const { user, group, world } = obj
  return `${user}${group}${world}`
}
export default Convert
