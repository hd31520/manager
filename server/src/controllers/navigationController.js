// Navigation controller removed. Recreate if navigation API is required.
// Previously this file contained logic to compute menu items based on
// user role and company permissions.

exports.getNavigation = async (req, res) => {
  return res.status(404).json({ success: false, message: 'Not implemented' })
}
