import { Dialog, IconButton } from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import { Formik, Form } from 'formik'
import { useNewProject } from '../../hooks/projects'
import { Text, TextField, Button } from '../../styleguide'
import { NewProjectPayload } from '../../types/payloads'
import { newProjectSchema } from '../../utils/validations'

const initialValues = {
  title: '',
  description: '',
  demoUrl: '',
  otherUrl: '',
}

type Props = {
  open: boolean
  onClose: () => void
  onCreated?: () => void
}

export const NewProjectModal: React.FC<Props> = ({ open, onClose }) => {
  const { mutateAsync: uploadProject, isLoading: isUploadingProject } = useNewProject()

  const handleSubmit = (values: NewProjectPayload): void => {
    uploadProject(values).then(() => onClose())
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: 'p-8' }}
    >
      <div className="flex justify-between items-center mb-16">
        <Text variant="h1">Upload project</Text>
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={newProjectSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="space-y-8">
            <div>
              <TextField
                name="title"
                label="Project title"
                inputProps={{ maxLength: 80 }}
              />
              <div className="flex justify-end">
                <Text variant="caption">{80 - values.title.length} characters left</Text>
              </div>
            </div>
            <TextField
              name="description"
              label="Project description (optional)"
              multiline
            />
            <TextField name="demoUrl" label="Demo URL" />
            <TextField name="otherUrl" label="Other URL (optional)" />
            <Button
              fullWidth
              type="submit"
              color="secondary"
              loading={isUploadingProject}
            >
              Upload
            </Button>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
