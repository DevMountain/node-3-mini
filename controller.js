exports.getPlanes = function(req, res) {
  var dbInstance = req.app.get('db')

  dbInstance.get_planes([25]).then(planes => {
      res.status(200).json(planes)
  })
}
