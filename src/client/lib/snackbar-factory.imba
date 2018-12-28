# documentation here https://github.com/FezVrasta/snackbarjs

export def snackbar message,type='normal'
  if type == 'normal'
    window:$.snackbar({
      content: message,
      timeout: 5000
    })
  else if type == 'alert'
    window:$.snackbar({
      content: message,
      timeout: 5000,
      style: "toast-alert"
    })
  else if type == 'success'
    window:$.snackbar({
      content: message,
      timeout: 5000,
      style: "toast-success"
    })
