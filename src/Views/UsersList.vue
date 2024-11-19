<template>
   
        <!-- Page container -->
        <div class="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5">
            <div class="row pt-sm-2 pt-lg-0">

                <!-- Sidebar (offcanvas on sreens < 992px) -->
                <aside class="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
                    <div class="position-lg-sticky top-0">
                        <div class="d-none d-lg-block" style="padding-top: 105px;"></div>
                        <div class="offcanvas-lg offcanvas-start" id="sidebarAccount">
                            <button class="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" type="button" data-bs-dismiss="offcanvas" data-bs-target="#sidebarAccount" aria-label="Close"></button>
                            <div class="offcanvas-body">
                                <nav class="nav flex-column pb-2 pb-lg-4 mb-3">
                                    <h4 class="fs-xs fw-medium text-body-secondary text-uppercase pb-1 mb-2">Menu</h4>
                                    <router-link  class="nav-link fw-semibold py-2 px-0" to="/admin">
                                        <i class="ai-dashboard  fs-5 opacity-60 me-2"></i> Dashboard
                                    </router-link>
                                    <router-link class="nav-link fw-semibold py-2 px-0" to="/users">
                                        <i class="ai-user-group fs-5 opacity-60 me-2"></i> Users
                                    </router-link>
                                    <router-link class="nav-link fw-semibold py-2 px-0" to="/markets">
                                        <i class="ai-shopping-bag fs-5 opacity-60 me-2"></i> Markets
                                    </router-link>
                                    <router-link class="nav-link fw-semibold py-2 px-0" to="/category">
                                        <i class="ai-grid fs-5 opacity-60 me-2"></i> Categorys
                                    </router-link>
                                </nav>

                            </div>
                        </div>
                    </div>
                </aside>


                <!-- Page content -->
                <div class="col-lg-9 pt-4 pb-2 pb-sm-4">
                    <h1 class="h2 mb-4">User list</h1>
                    <router-link to='/addUser'>
                        <button type="button" class="btn btn-primary btn-sm ms-auto d-block">
                      <i class="ai-user-plus me-2 ms-n1"></i>Add user
                  </button>
                </router-link>
                    <div class="row position-relative overflow-hidden gx-2 z-1">
                        <div class="table-responsive mt-3">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First Name</th>
                                        <th scope="col">Last Name</th>
                                        <th scope="col">E-mail</th>
                                        <th scope="col">Phone</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>John</td>
                                        <td>Doe</td>
                                        <td>johndoe@gmail.com</td>
                                        <td>+3 555 68 70</td>
                                        <td class="d-flex align-items-center">
    <!-- Edit Button -->
    <router-link
        to="editUser"
        class="btn btn-link fw-semibold py-2 px-0"
        title="Edit"
    >
        <i class="ai-edit fs-5 me-2"></i>
    </router-link>

    <!-- Delete Button -->
    <router-link
        to="/users  "
        class="btn btn-link fw-semibold py-2 px-0"
        title="Delete"
    >
        <i class="ai-trash fs-5"></i>
    </router-link>
</td>

                                    </tr>
                                </tbody>
                            </table>

                            <!-- Edit Modal -->
                            <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="editModalLabel">Edit Item</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form id="editForm">
                                                <div class="mb-3">
                                                    <label for="firstName" class="form-label">First Name</label>
                                                    <input type="text" class="form-control" id="firstName" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="lastName" class="form-label">Last Name</label>
                                                    <input type="text" class="form-control" id="lastName" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="email" class="form-label">E-mail</label>
                                                    <input type="email" class="form-control" id="email" required>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="phone" class="form-label">Phone</label>
                                                    <input type="tel" class="form-control" id="phone" required>
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary">Save changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            

                            <nav aria-label="Page navigation example">
                                <div class="text-center">
                                    <ul class="pagination justify-content-center">
                                        <li class="page-item">
                                            <a href="#" class="page-link">Prev</a>
                                        </li>
                                        <li class="page-item d-sm-none">
                                            <span class="page-link pe-none">2 / 5</span>
                                        </li>
                                        <li class="page-item d-none d-sm-block">
                                            <a href="#" class="page-link">1</a>
                                        </li>
                                        <li class="page-item active d-none d-sm-block" aria-current="page">
                                            <span class="page-link">
                                              2
                                              <span class="visually-hidden">(current)</span>
                                            </span>
                                        </li>
                                        <li class="page-item d-none d-sm-block">
                                            <a href="#" class="page-link">3</a>
                                        </li>
                                        <li class="page-item d-none d-sm-block">
                                            <a href="#" class="page-link">4</a>
                                        </li>
                                        <li class="page-item d-none d-sm-block">
                                            <a href="#" class="page-link">5</a>
                                        </li>
                                        <li class="page-item">
                                            <a href="#" class="page-link">Next</a>
                                        </li>
                                    </ul>
                                </div>
                            </nav>


                        </div>
                    </div>

                    <!-- Divider for dark mode only -->
                    <hr class="d-none d-dark-mode-block">

                    <!-- Sidebar toggle button -->
                    <button class="d-lg-none btn btn-sm fs-sm btn-primary w-100 rounded-0 fixed-bottom" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarAccount">
        <i class="ai-menu me-2"></i>
        Account menu
      </button>
                </div>
            </div>
        </div>
        
</template>
<script>
export default {
    name :'UsersListComponent',
}
</script>
 <style>
        .page-loading {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            -webkit-transition: all .4s .2s ease-in-out;
            transition: all .4s .2s ease-in-out;
            background-color: #fff;
            opacity: 0;
            visibility: hidden;
            z-index: 9999;
        }

        [data-bs-theme="dark"] .page-loading {
            background-color: #121519;
        }

        .page-loading.active {
            opacity: 1;
            visibility: visible;
        }

        .page-loading-inner {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            text-align: center;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
            -webkit-transition: opacity .2s ease-in-out;
            transition: opacity .2s ease-in-out;
            opacity: 0;
        }

        .page-loading.active>.page-loading-inner {
            opacity: 1;
        }

        .page-loading-inner>span {
            display: block;
            font-family: "Inter", sans-serif;
            font-size: 1rem;
            font-weight: normal;
            color: #6f788b;
        }

        [data-bs-theme="dark"] .page-loading-inner>span {
            color: #fff;
            opacity: .6;
        }

        .page-spinner {
            display: inline-block;
            width: 2.75rem;
            height: 2.75rem;
            margin-bottom: .75rem;
            vertical-align: text-bottom;
            background-color: #d7dde2;
            border-radius: 50%;
            opacity: 0;
            -webkit-animation: spinner .75s linear infinite;
            animation: spinner .75s linear infinite;
        }

        [data-bs-theme="dark"] .page-spinner {
            background-color: rgba(255, 255, 255, .25);
        }

        @-webkit-keyframes spinner {
            0% {
                -webkit-transform: scale(0);
                transform: scale(0);
            }
            50% {
                opacity: 1;
                -webkit-transform: none;
                transform: none;
            }
        }

        @keyframes spinner {
            0% {
                -webkit-transform: scale(0);
                transform: scale(0);
            }
            50% {
                opacity: 1;
                -webkit-transform: none;
                transform: none;
            }
        }

    
    </style>