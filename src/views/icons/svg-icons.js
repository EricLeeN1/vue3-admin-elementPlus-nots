const modules = import.meta.glob('../../icons/svg/*.svg')

const requireAll = (requireContext) => {
  return Object.keys(requireContext)
}
const re = /(.*\/)+(.*)\.svg/

const svgIcons = requireAll(modules).map((i) => {
  return i.match(re)[2]
})
export default svgIcons
