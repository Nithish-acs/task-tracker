// pages/tasks.js
import withAuth from '../withAuth';

function Tasks() {
  return <div>Protected Tasks Page</div>;
}

export default withAuth(Tasks);
