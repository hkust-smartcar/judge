import {snackbar} from './snackbar-factory'

export def alertHandler object
  const type = object:type
  if type == 'message'
    snackbar object:message
  else if type == 'result'
    if object:error
      snackbar "Submit {object:submission_id} have error {object:error}",'alert'
    else if object:status == 'Pending'
      snackbar "Submit {object:submission_id} pending for grading"
    else if object:status == 'Completed'
      snackbar "Submit {object:submission_id} scores {object:score} at subtask {object:subtask_id}","success"