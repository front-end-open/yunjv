function rename(This) {
<<<<<<< HEAD
  console.log(This)
  if (This.path == '/') {
    This.$set(This.tableData, This.formDate.id, {
      'id': Math.random(),
      'isdir': This.tableData[This.formDate.id].isdir,
      'parent': This.tableData[This.formDate.id].parent,
      'local_mtime': This.tableData[This.formDate.id].local_mtime,
      'parentsPath': This.tableData[This.formDate.id].parentsPath,
      'repos_id': This.tableData[This.formDate.id].repos_id,
      'server_filename': This.formDate.name,
      'size': This.tableData[This.formDate.id].size,
      'path': `${This.path}${This.formDate.name}`,
    })
  } else {
    This.$set(This.tableData, This.formDate.id, {
      'id': Math.random(),
      'isdir': This.tableData[This.formDate.id].isdir,
      'local_mtime': This.tableData[This.formDate.id].local_mtime,
      'parent': This.tableData[This.formDate.id].parent,
      'parentsPath': This.tableData[This.formDate.id].parentsPath,
      'repos_id': This.tableData[This.formDate.id].repos_id,
      'server_filename': This.formDate.name,
      'size': This.tableData[This.formDate.id].size,
      'path': `${This.path}/${This.formDate.name}`,
    })
  }
=======
    console.log(This)
    if (This.path == '/') {
        This.$set(This.tableData, This.formDate.id, {
            'id': Math.random(),
            'isdir': This.tableData[This.formDate.id].isdir,
            'parent': This.tableData[This.formDate.id].parent,
            'local_mtime': This.tableData[This.formDate.id].local_mtime,
            'parentsPath': This.tableData[This.formDate.id].parentsPath,
            'repos_id': This.tableData[This.formDate.id].repos_id,
            'server_filename': This.formDate.name,
            'size': This.tableData[This.formDate.id].size,
            'path': `${This.path}${This.formDate.name}`,
        })
    } else {
        This.$set(This.tableData, This.formDate.id, {
            'id': Math.random(),
            'isdir': This.tableData[This.formDate.id].isdir,
            'local_mtime': This.tableData[This.formDate.id].local_mtime,
            'parent': This.tableData[This.formDate.id].parent,
            'parentsPath': This.tableData[This.formDate.id].parentsPath,
            'repos_id': This.tableData[This.formDate.id].repos_id,
            'server_filename': This.formDate.name,
            'size': This.tableData[This.formDate.id].size,
            'path': `${This.path}/${This.formDate.name}`,
        })
    }
>>>>>>> feat(filelist.vue): 右击菜单
}
export default rename
