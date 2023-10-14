# Git Wind
___
## Table of contents

1. Introduction
2. Features
3. Installation
4. Usage
5. Support
6. License
---
<a name="introduction"></a>
## Introduction
GitWind is an **Open-Source** productivity application aimed at assisting developers in managing multiple Git accounts effortlessly.
___
<a name="features"></a>
## Features
* **Account Manager:** Create and manage profiles for each Git account, including credentials.
* **Repository Cloning:** Allows to clone repository based on the account you choose.
* **Create Repository:** Enables to create repository and add a user to it.
* **Change Account:** Allows to set or change git account of a repository.
___
<a name="installation"></a>
## Installation
To install `GitWind`, follow these steps:
1. Download the GitWind installer for your operating system from the release section of the GitHub.
2. Run the installer and follow the on-screen instructions.
3. Launch GitWind after the installation is complete.
Caution: We recommend using `install for the current account` for your use only, rather than `installing for all users`.
___
<a name="usage"></a>
## Usage
To use `GitWind`:

* ### Account manager.
   1. Enter `username` of your git account.
   2. Enter `email` of your git account.
   3. Browse or enter the `ssh key file path` of your git account.
   - To know more about git authentication steps using ssh for popular git providers, please refer below.
       - https://docs.github.com/en/authentication/connecting-to-github-with-ssh
       - https://docs.gitlab.com/ee/user/ssh.html
       - https://support.atlassian.com/bitbucket-cloud/docs/configure-ssh-and-two-step-verification/
     
* ### Clone repository
  1. Enter or browse the directory for the repo to be saved.
  2. Select user to clone repository using his/her credentials (currently we are supporting ssh based authentication only). 
  3. Enter the https url in case of cloning public repositories.
  4. Else use ssh url to clone from private repository. Make sure that the selected user have access to that particular repository. 
  Note that while cloning private repository, we are overriding git sshCommand locally, so there is no security issue on our side.
  5. Enter branch name to clone from a specified branch, it is optional.
  6. Click clone

* ### Create repository
  1. Enter or browse the directory for the repo to be created.
  2. Select user to create repository using his/her credentials.
  3. Click create.

* ### Change account
  1. Select repository that needs to change the user of the repository.
  2. Select user that you want to assign for the repository.
  3. Note it will only change from the current commit.

<a name="contributing"></a>
## Contributing
  We welcome contributions to make `GitWind` even better! If you have suggestions, bug reports, or feature requests, please submit an issue, else ping me through email [kabildeveloper@gmail.com](mailto:kabildeveloper@gmail.com) 
  Currently, we don't have guidelines to contribute, will add soon. 
  Thanks for the patience.

<a name="support"></a>
## Support
  For any inquires, feedback, or assistance, reach out to me at [kabildeveloper@gmail.com](mailto:kabildeveloper@gmail.com).

<a name="credits"></a>
## Credits
* [Git](https://git-scm.com/)
* [Electron React Boilerplate](https://electron-react-boilerplate.js.org/)
* [Bootstrap 5](https://getbootstrap.com/)
* [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
* [react-dropdown](https://github.com/fraserxu/react-dropdown)
* [Electron](https://www.electronjs.org/), [electron-builder](https://www.electron.build/)
* [React](https://react.dev/)
* [simple-git](https://github.com/steveukx/git-js#readme)
* React Unicons by [IconScout](https://iconscout.com/)

<a name="change-log"></a>
## Changelog
  - **[v0.0.1-beta]**
    - This is first beta and very first release of this product.
    - Added account manager.
    - Added repository cloning functionality.
    - Added repository creating functionality.
    - Added repository user switch functionality.
    - Authentication done based on ssh only.



