import { Formik, Form } from 'formik'
import { Paper } from '@material-ui/core'
import { Button, ConfirmationDialog, Text, TextField } from '../../styleguide'
import { useState } from 'react'
import { deleteUser } from '../../requests'
import { signOut } from 'next-auth/client'
import { useAuth } from '../../contexts/auth'

export const ManageAccount: React.FC = () => {
  const { user } = useAuth()
  const [shouldDeleteAccount, setShouldDeleteAccount] = useState<boolean>(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false)

  const handleDeleteAccount = () => {
    setIsDeletingAccount(true)
    // this needs to be in auth context
    deleteUser().then(() => signOut())
  }

  const initialValues = {
    name: user?.name,
    surname: user?.surname,
    email: user?.email,
    school: user?.school,
    programme: user?.programme,
  }

  return (
    <>
      <div className="flex space-x-6">
        <Paper className="w-1/2 p-6">
          <Text variant="h2" className="mb-12">
            Personal information
          </Text>

          <Formik
            enableReinitialize // whenever user changes
            initialValues={initialValues}
            onSubmit={() => {}}
          >
            <Form className="space-y-6">
              <TextField disabled name="name" label="First name" />
              <TextField disabled name="surname" label="Last name" />
              <TextField disabled name="email" label="Email" />
              <TextField disabled name="school" label="School" />
              <TextField disabled name="programme" label="Programme" />
            </Form>
          </Formik>
        </Paper>
        <Paper className="w-1/2 p-6">
          <Text variant="h2" className="mb-12">
            Settings
          </Text>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setShouldDeleteAccount(true)}
          >
            Delete account
          </Button>
        </Paper>
      </div>

      <ConfirmationDialog
        open={shouldDeleteAccount}
        onClose={() => setShouldDeleteAccount(false)}
        onConfirm={handleDeleteAccount}
        confirmText="Delete"
        loading={isDeletingAccount}
      />
    </>
  )
}
