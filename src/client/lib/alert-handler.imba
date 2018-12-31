import {snackbar} from './snackbar-factory'

export def alertHandler object
  const type = object:type
  if type == 'message'
    snackbar object:message, object:type
  else if type == 'result'
    # if object:error
    #   if !object:subtask_id
    #     snackbar "Submit {object:submission_id} have error: {object:error}",'alert'
    if object:status == 'Pending'
      snackbar "Submit {object:submission_id} pending for grading"
    else if object:status == 'Completed'
      if object:subtask_id == undefined
        snackbar "Submit {object:submission_id} scores {object:score}","success"
    else if object:status == 'Submitted'
      snackbar "Submitted job {object:submission_id}"